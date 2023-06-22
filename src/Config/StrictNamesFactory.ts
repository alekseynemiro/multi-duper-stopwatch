export function strictNamesFactory(): StrictNamesFactory<{}> {
  return new StrictNamesFactory<{}>({});
}

class StrictNamesFactory<T> {

  private readonly _ids: T;

  public constructor(ids: T) {
    this._ids = ids;
  }

  public add<N extends string>(id: N): StrictNamesFactory<T & { [n in N]: symbol }> {
    // tslint:disable-next-line: no-object-literal-type-assertion
    const added = { [id]: Symbol.for(id) } as { [n in N]: symbol };

    return new StrictNamesFactory<T & { [n in N]: symbol }>({
      ...this._ids,
      ...added,
    });
  }

  public build(): T {
    return this._ids;
  }

}
