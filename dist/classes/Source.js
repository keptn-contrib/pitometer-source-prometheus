"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class Source {
    constructor({ queryUrl }) {
        this.queryUrl = '';
        this.queryUrl = queryUrl;
    }
    setOptions(options) {
        this.timeStart = options.timeStart;
        this.timeEnd = options.timeEnd;
        this.context = options.context;
    }
    fetch(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.timeStart || !this.timeEnd)
                throw new Error('No start and/or end time was set!');
            // tslint:disable-next-line: max-line-length
            const response = yield axios_1.default
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
        });
    }
}
exports.Source = Source;
//# sourceMappingURL=Source.js.map