import { Component, computed, input } from '@angular/core';
import { CampusEvent } from '../campus-event';

@Component({
  selector: 'app-event-summary',
  styleUrl: './event-summary.css',
  templateUrl: './event-summary.html',
})
export class EventSummary {
  events = input.required<CampusEvent[]>();
  now = input(new Date());

  count = computed(() => this.events().length);

  totalCapacity = computed(() => this.events().reduce((sum, e) => sum + e.capacity, 0));

  nextEvent = computed(() =>
    this.events()
      .filter((e) => new Date(e.date) >= this.now())
      .reduce<CampusEvent | null>((earliest, e) => {
        if (earliest === null || e.date < earliest.date) {
          return e;
        }
        return earliest;
      }, null),
  );
}
