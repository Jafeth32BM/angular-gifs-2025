import { Component, computed, inject } from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { GifService } from '../../services/gifs.service';
import { GifList } from "../../components/gif-list/gif-list";

@Component({
  selector: 'gif-history',
  imports: [GifList],
  templateUrl: './gif-history.html',
})
export default class GifHistory {
  gifsService = inject(GifService);
  qwery = toSignal(
    inject(ActivatedRoute).params.pipe(
      map(params => params['qwery']))
  );

  gifsByKey = computed(() => this.gifsService.getHistoryGifs(this.qwery()));
}
