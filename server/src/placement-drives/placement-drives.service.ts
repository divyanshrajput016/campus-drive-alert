import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface LoginResponse {
  accessToken: string;
}

@Injectable()
export class PlacementDrivesService {
  async getPlacementDrives() {
    try {
      const loginURL = process.env.LOGIN_URL;
      const placementDrivesURL = process.env.PLACEMENT_DRIVES_URL;

      if (!loginURL) {
        throw new Error('LOGIN_URL is not defined');
      }

      const response = await axios.post<LoginResponse>(
        loginURL,
        {
          email: process.env.EMAIL,
          password: process.env.PASSWORD,
        },
      );

      const token: string = response.data.accessToken;

      if (!placementDrivesURL) {
        throw new Error('PLACEMENT_DRIVES_URL is not defined');
      }

      const placementResponse = await axios.get(
        placementDrivesURL,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return placementResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fetch placement drives: ${error.response?.data?.message || error.message}`,
        );
      }
      throw new Error('Failed to fetch placement drives: ' + (error as Error).message);
    }
  }
}