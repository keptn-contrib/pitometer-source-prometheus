/**
 * Copyright 2019, Dynatrace
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import axios from 'axios';

import * as pitometer from 'pitometer';

export class Source implements pitometer.ISource {

  private queryUrl = '';
  private timeStart: number;
  private timeEnd: number;
  private context: string;

  constructor({ queryUrl }) {
    this.queryUrl = queryUrl;
  }

  public setOptions(options: pitometer.IOptions) {
    this.timeStart = options.timeStart;
    this.timeEnd = options.timeEnd;
    this.context = options.context;
  }

  async fetch(query): Promise<pitometer.ISourceResult[] | boolean> {
    if (!this.timeStart || !this.timeEnd) throw new Error('No start and/or end time was set!');
    // tslint:disable-next-line: max-line-length
    const response = await axios
      // tslint:disable-next-line: max-line-length
      .post(`${this.queryUrl}?query=${encodeURIComponent(query)}&start=${this.timeStart}&end=${this.timeEnd}`);

    const promresult = response.data;

    if (promresult.status !== 'success') {
      throw new Error(`Prometheus query returned returned ${promresult.status} for (${query})`);
    }

    if (promresult.data.resultType === 'matrix') {
      throw new Error(`Prometheus query returned a not supported matrix result for (${query})`);
    }

    return promresult.data.result.map((entry) => {
      return {
        key: JSON.stringify(entry.metric),
        timestamp: entry.value[0],
        value: entry.value[1],
      };
    });

  }
}
