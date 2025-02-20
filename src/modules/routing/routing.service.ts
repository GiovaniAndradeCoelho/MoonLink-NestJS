// src/modules/routing/routing.service.ts

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import axios from 'axios';

export interface Coordinate {
  lat: number;
  lon: number;
}

/**
 * RoutingService provides functionality for geocoding addresses
 * and calculating routes using external APIs.
 */
@Injectable()
export class RoutingService {
  private readonly logger = new Logger(RoutingService.name);

  /**
   * Geocodes an address using the Nominatim API.
   *
   * @param address - The address to be geocoded.
   * @returns A promise that resolves to a Coordinate object containing latitude and longitude.
   * @throws {BadRequestException} If the address cannot be geocoded.
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
          'User-Agent': 'MeuERP/1.0 (email@dominio.com)', // Replace with your User-Agent
        },
      });

      if (!response.data || response.data.length === 0) {
        throw new Error(`Address not found: ${address}`);
      }

      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
      };
    } catch (error: any) {
      this.logger.error(`Error geocoding address "${address}": ${error.message}`, error.stack);
      throw new BadRequestException(`Error geocoding address "${address}": ${error.message}`);
    }
  }

  /**
   * Calculates a route (distance, duration, and geometry) based on origin, destination,
   * and optional stops using the OSRM API.
   *
   * @param originAddress - The origin address.
   * @param destinationAddress - The destination address.
   * @param stopsAddresses - Optional array of stop addresses.
   * @returns A promise that resolves to the calculated route containing distance, duration, and GeoJSON geometry.
   * @throws {BadRequestException} If route calculation fails.
   */
  async calculateRouteByAddresses(
    originAddress: string,
    destinationAddress: string,
    stopsAddresses: string[] = [],
  ): Promise<any> {
    try {
      // Geocode origin, destination, and stops concurrently.
      const originPromise = this.geocodeAddress(originAddress);
      const destinationPromise = this.geocodeAddress(destinationAddress);
      const stopsPromises = stopsAddresses.map(addr => this.geocodeAddress(addr));

      const [origin, destination, ...stops] = await Promise.all([
        originPromise,
        destinationPromise,
        ...stopsPromises,
      ]);

      // Build coordinates string in the format "lon,lat;lon,lat;..."
      const coordinates = [origin, ...stops, destination]
        .map(coord => `${coord.lon},${coord.lat}`)
        .join(';');

      const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
      const osrmResponse = await axios.get(osrmUrl);

      if (!osrmResponse.data || osrmResponse.data.code !== 'Ok') {
        throw new Error(`Error calculating route: ${osrmResponse.data?.message || 'Unknown error'}`);
      }

      let route = osrmResponse.data.routes[0];

      // Add computed properties for clarity.
      route['distance_km'] = route['distance'] / 1000;
      route['duration_minutes'] = route['duration'] / 60;
      route['duration_hours'] = route['duration_minutes'] / 60;

      return route;
    } catch (error: any) {
      this.logger.error(`Error calculating route: ${error.message}`, error.stack);
      throw new BadRequestException(`Error calculating route: ${error.message}`);
    }
  }
}