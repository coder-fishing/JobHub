import api from '@/lib/axios';
import {
  ClientProfileResponse,
  UpdateClientProfilePayload,
  ClientJobHistoryDTO,
} from '@/types/api';

export const clientService = {
  /**
   * Lấy thông tin hồ sơ Client hiện tại
   */
  async getMyProfile(): Promise<ClientProfileResponse> {
    const response = await api.get<ClientProfileResponse>('/client/profile/me');
    return response.data;
  },

  /**
   * Cập nhật thông tin hồ sơ Client
   */
  async updateMyProfile(
    payload: UpdateClientProfilePayload
  ): Promise<ClientProfileResponse> {
    const response = await api.put<ClientProfileResponse>(
      '/client/profile/me',
      payload
    );
    return response.data;
  },

  /**
   * Lấy hồ sơ Client công khai theo clientId
   */
  async getClientProfilePublic(
    clientId: number | string
  ): Promise<ClientProfileResponse> {
    const response = await api.get<ClientProfileResponse>(
      `/client/profile/${clientId}`
    );
    return response.data;
  },

  /**
   * Lấy lịch sử tuyển dụng (danh sách dự án) của Client
   */
  async getClientJobHistory(
    clientId: number | string
  ): Promise<ClientJobHistoryDTO[]> {
    const response = await api.get<ClientJobHistoryDTO[]>(
      `/client/profile/${clientId}/jobs`
    );
    return response.data;
  },
};
