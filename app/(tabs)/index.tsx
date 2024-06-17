import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Article, getNews } from '@/api/NewsApi';
import { storeSearchHistory, getSearchHistory } from '@/utils/Storage';

export default function HomeScreen() {
  const [query, setQuery] = useState<string>('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const savedHistory = await getSearchHistory();
      setHistory(savedHistory);
    };
    loadHistory();
  }, []);

  const searchNews = async () => {
    setError('');
    try {
      const results = await getNews(query);
      setArticles(results);
      storeSearchHistory(query);
      setHistory([query, ...history]);
    } catch (err) {
      setError('Error fetching news. Please try again.');
    }
  };

  const handleHistoryPress = async (searchQuery: string) => {
    setQuery(searchQuery);
    await searchNews();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>News Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Search for news..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={searchNews} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={articles}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <View style={styles.article}>
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
              <Text style={styles.link}>Read more</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Search History</Text>
        {history.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleHistoryPress(item)}>
            <Text style={styles.historyItem}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  article: {
    marginTop: 10,
    marginBottom: 10,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: 'blue',
    marginTop: 5,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  historyContainer: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    color: 'blue',
    marginBottom: 5,
  },
});