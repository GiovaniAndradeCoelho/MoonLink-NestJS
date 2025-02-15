// src/modules/routing/routing.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

export interface Coordinate {
  lat: number;
  lon: number;
}

@Injectable()
export class RoutingService {
  /**
   * Geocodifica um endereço utilizando a API do Nominatim.
   * @param address Endereço a ser geocodificado.
   * @returns Um objeto Coordinate contendo latitude e longitude.
   */
  async geocodeAddress(address: string): Promise<Coordinate> {
    const url = 'https://nominatim.openstreetmap.org/search';
    try {
      const response = await axios.get(url, {
        params: {
          format: 'json',
          q: address,
        },
        headers: {
          'User-Agent': 'MeuERP/1.0 (email@dominio.com)', // Substitua pelo seu User-Agent
        },
      });

      if (response.data.length === 0) {
        throw new Error(`Endereço não encontrado: ${address}`);
      }

      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
      };
    } catch (error: any) {
      throw new BadRequestException(`Erro ao geocodificar o endereço "${address}": ${error.message}`);
    }
  }

  /**
   * Calcula a rota (distância, duração e geometria) com base em endereços.
   * @param originAddress Endereço de origem.
   * @param destinationAddress Endereço de destino.
   * @param stopsAddresses Array opcional de endereços de pontos de parada.
   * @returns A rota calculada com informações de distância, duração e geometria (GeoJSON).
   */
  async calculateRouteByAddresses(
    originAddress: string,
    destinationAddress: string,
    stopsAddresses: string[] = []
  ): Promise<any> {
    try {
      const originPromise = this.geocodeAddress(originAddress);
      const destinationPromise = this.geocodeAddress(destinationAddress);
      const stopsPromises = stopsAddresses.map(addr => this.geocodeAddress(addr));

      const [origin, destination, ...stops] = await Promise.all([
        originPromise,
        destinationPromise,
        ...stopsPromises,
      ]);

      const coordinates = [origin, ...stops, destination]
        .map(coord => `${coord.lon},${coord.lat}`)
        .join(';');

      const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
      const osrmResponse = await axios.get(osrmUrl);

      if (osrmResponse.data.code !== 'Ok') {
        throw new Error(`Erro ao calcular rota: ${osrmResponse.data.message}`);
      }

      let route = osrmResponse.data.routes[0];

      route['distance_km'] = route['distance'] / 1000;

      route['duration_minutes'] = route['duration'] / 60;

      route['duration_hours'] = route['duration_minutes'] / 60;

      return route;
    } catch (error: any) {
      throw new BadRequestException(`Erro ao calcular rota: ${error.message}`);
    }
  }
}
