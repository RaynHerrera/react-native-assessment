import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_HISTORY_KEY = 'SEARCH_HISTORY';

export const storeSearchHistory = async (query: string) => {
  try {
    let history = await getSearchHistory();
    if (!history.includes(query)) {
      history = [query, ...history].slice(0, 10);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    }
  } catch (error) {
    console.error('Error storing search history:', error);
  }
};

export const getSearchHistory = async (): Promise<string[]> => {
  try {
    const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error retrieving search history:', error);
    return [];
  }
};
