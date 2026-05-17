/* eslint-disable @typescript-eslint/no-explicit-any */

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class MockQueryBuilder {
  private table: string;
  private data: Map<string, any>;
  private filters: Array<(row: any) => boolean> = [];
  private _single = false;
  private _limit: number | null = null;
  private _order: { column: string; ascending: boolean } | null = null;
  private _insertValues: any[] | null = null;
  private _updateValues: any | null = null;
  private _selectColumns: string | null = null;

  constructor(table: string, data: Map<string, any>) {
    this.table = table;
    this.data = data;
  }

  select(columns?: string) {
    this._selectColumns = columns || '*';
    console.log(`[SUPABASE MOCK] SELECT from ${this.table} columns=${this._selectColumns}`);
    return this;
  }

  insert(values: any | any[]) {
    this._insertValues = Array.isArray(values) ? values : [values];
    return this;
  }

  update(values: any) {
    this._updateValues = values;
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((row) => row[column] === value);
    return this;
  }

  single() {
    this._single = true;
    return this;
  }

  limit(n: number) {
    this._limit = n;
    return this;
  }

  order(column: string, { ascending = true } = {}) {
    this._order = { column, ascending };
    return this;
  }

  private execute(): { data: any; error: null } {
    // Handle insert
    if (this._insertValues) {
      const inserted: any[] = [];
      for (const v of this._insertValues) {
        const row = { id: generateUUID(), created_at: new Date().toISOString(), ...v };
        this.data.set(row.id, row);
        inserted.push(row);
        console.log(`[SUPABASE MOCK] INSERT into ${this.table}:`, JSON.stringify(row, null, 2));
      }
      if (this._single) {
        return { data: inserted[0] || null, error: null };
      }
      return { data: inserted, error: null };
    }

    // Handle update
    if (this._updateValues) {
      let updated = 0;
      for (const [id, row] of this.data) {
        if (this.filters.every((f) => f(row))) {
          this.data.set(id, { ...row, ...this._updateValues });
          updated++;
        }
      }
      console.log(`[SUPABASE MOCK] UPDATE ${this.table} SET ${JSON.stringify(this._updateValues)} (${updated} rows)`);
      return { data: null, error: null };
    }

    // Handle select/query
    let rows = Array.from(this.data.values());
    for (const filter of this.filters) {
      rows = rows.filter(filter);
    }
    if (this._order) {
      rows.sort((a, b) => {
        const av = a[this._order!.column];
        const bv = b[this._order!.column];
        if (av < bv) return this._order!.ascending ? -1 : 1;
        if (av > bv) return this._order!.ascending ? 1 : -1;
        return 0;
      });
    }
    if (this._limit !== null) {
      rows = rows.slice(0, this._limit);
    }

    console.log(`[SUPABASE MOCK] QUERY ${this.table} returned ${this._single ? (rows[0] ? 1 : 0) : rows.length} rows`);

    if (this._single) {
      return { data: rows[0] || null, error: null };
    }
    return { data: rows, error: null };
  }

  then(onfulfilled?: any, onrejected?: any): Promise<any> {
    return Promise.resolve(this.execute()).then(onfulfilled, onrejected);
  }
}

class MockSupabaseClient {
  private tables: Record<string, Map<string, any>> = {};

  from(table: string) {
    if (!this.tables[table]) {
      this.tables[table] = new Map();
    }
    return new MockQueryBuilder(table, this.tables[table]);
  }
}

export const mockSupabaseClient = new MockSupabaseClient();
