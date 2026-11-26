import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CampusEvent } from '../campus-event';
import { EventCard } from '../event-card/event-card';
import { EventSummary } from '../event-summary/event-summary';

@Component({
  imports: [EventCard, EventSummary],
  selector: 'app-event-list',
  styleUrl: './event-list.css',
  templateUrl: './event-list.html',
})
export class EventList {
  events = signal<CampusEvent[]>([
    {
      id: 1,
      title: 'Welcome party for Erasmus students',
      description: 'Meet the other exchange students, eat pizza and get your welcome pack.',
      date: '2026-10-15T18:00',
      location: 'Main hall, building A',
      capacity: 120,
    },
    {
      id: 2,
      title: 'Hackathon: apps for the city',
      description: 'Build an app that makes life in Kraków easier.',
      date: '2026-11-07T09:00',
      location: 'Lab 204',
      capacity: 40,
    },
    {
      id: 3,
      title: 'Board game night',
      description: '',
      date: '2026-10-22T19:00',
      location: 'Student club',
      capacity: 30,
    },
    {
      id: 4,
      title: 'Pierogi workshop',
      description: 'Learn to make pierogi ruskie from scratch and eat what you cook.',
      date: '2026-12-03T17:00',
      location: 'Student kitchen',
      capacity: 15,
    },
    {
      id: 5,
      title: 'Movie night: Polish classics',
      description: 'Two Polish films with English subtitles. Popcorn included.',
      date: '2026-11-19T20:00',
      location: 'Cinema room, building B',
      capacity: 60,
    },
    {
      id: 6,
      title: 'Trip to the Wieliczka Salt Mine',
      description: 'Guided tour of the salt mine. Bring warm clothes, it is cold underground.',
      date: '2026-11-14T09:30',
      location: 'Main gate',
      capacity: 35,
    },
    {
      id: 7,
      title: 'Christmas market walk',
      description: 'A walk through the Christmas market on the Main Square, with grzaniec.',
      date: '2026-12-12T16:00',
      location: 'Main Market Square',
      capacity: 50,
    },
    {
      id: 8,
      title: 'Thanksgiving potluck',
      description: 'Everyone brings one dish from their country.',
      date: '2026-11-26T20:00',
      location: 'Student club',
      capacity: 40,
    },
    {
      id: 9,
      title: 'Ski weekend in Zakopane',
      description: '',
      date: '2027-01-16T07:00',
      location: 'Bus stop at the main gate',
      capacity: 45,
    },
  ]);

  search = signal('');
  sortBy = signal<'date' | 'title'>('date');
  now = signal(new Date());
  favourites = signal<number[]>([]);

  visibleEvents = computed(() => {
    const q = this.search().toLowerCase();
    // filter() returns a new array, so sort() below never changes events()
    const result = this.events().filter((e) => e.title.toLowerCase().includes(q));
    if (this.sortBy() === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort((a, b) => a.date.localeCompare(b.date));
    }
    return result;
  });

  upcomingEvents = computed(() =>
    this.visibleEvents().filter((e) => new Date(e.date) >= this.now()),
  );

  pastEvents = computed(() => this.visibleEvents().filter((e) => new Date(e.date) < this.now()));

  constructor() {
    // update "now" every minute, so an event moves to Past when it starts
    const timer = setInterval(() => this.now.set(new Date()), 60_000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  isFavourite(id: number) {
    return this.favourites().includes(id);
  }

  toggleFavourite(event: CampusEvent) {
    if (this.isFavourite(event.id)) {
      this.favourites.update((ids) => ids.filter((x) => x !== event.id));
    } else {
      this.favourites.update((ids) => [...ids, event.id]);
    }
  }
}
