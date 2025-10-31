import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { GifList } from "../../components/gif-list/gif-list";
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifList],
  templateUrl: './search-page.html'
})
export  default class Search {
  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>;

  gifsService = inject(GifService)
  gifs = signal<Gif[]>([]);

  onSearch(qwery: string){
    this.gifsService.searchGifs(qwery)
    .subscribe( resp =>{
      this.gifs.set(resp);
      this.txtSearch.nativeElement.value = '';
    });
  }
}
