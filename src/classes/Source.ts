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

  constructor({ queryUrl }) {
    this.queryUrl = queryUrl;
  }

  async fetch(query) {
    const response = await axios.post(`${this.queryUrl}?query=${query}`);
    const promresult = response.data;
    console.log(JSON.stringify(promresult));
    return promresult.data.result[0].value[1];
  }
}
