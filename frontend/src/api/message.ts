import axios from 'axios';
import { fetchMessageURL } from './constants';

const fetchMessages = async (applicationId: string): Promise<any[]> => {
    try {
        const response = await axios.get(fetchMessageURL, {
          params: { applicationId },
        });
    
        if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
          return response.data.data;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
}

export { fetchMessages };