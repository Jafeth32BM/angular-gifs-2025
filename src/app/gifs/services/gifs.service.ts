import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIF_KEY = 'gifs'

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);

  return gifs
}


@Injectable({ providedIn: 'root' })
export class GifService {

  saveToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString)
  })


  envs = environment;
  private http = inject(HttpClient);
  trendingGifs = signal<Gif[]>([]);
  searchGif = signal<Gif[]>([]);
  trendingGifsLoading = signal(false);
  private trandingPage = signal(0);

  trendignGifGroup = computed<Gif[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }
    return groups;
  })

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    if (this.trendingGifsLoading()) return;
    this.trendingGifsLoading.set(true);

    this.http.get<GiphyResponse>(`${this.envs.giphyUrl}/gifs/trending`, {
      params: {
        api_key: this.envs.giphyApiKey,
        limit: 27,
        offset: this.trandingPage() * 27,
      }
    }).subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.update(currentGifs => [...currentGifs, ...gifs]);
      this.trandingPage.update(page => page + 1);
      this.trendingGifsLoading.set(false);
    })

  }

  searchGifs(qwery: string): Observable<Gif[]> {
    return this.http.get<GiphyResponse>(`${this.envs.giphyUrl}/gifs/search`, {
      params: {
        api_key: this.envs.giphyApiKey,
        q: qwery,
        limit: 27,
      }
    }).pipe(
      map(({ data }) => data),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
      // Historial
      tap((items) => {
        this.searchHistory.update(history => ({
          ...history,
          [qwery.toLowerCase()]: items,
        }))
      }))
  }

  getHistoryGifs(qwery: string): Gif[] {
    return this.searchHistory()[qwery] ?? [];
  }
}
