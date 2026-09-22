export abstract class BaseEntity<TId = string> {
  protected readonly _id: TId;

  constructor(id: TId) {
    this._id = id;
  }

  public get id(): TId {
    return this._id;
  }

  public equals(other?: BaseEntity<TId> | null): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (this === other) {
      return true;
    }

    if (!(other instanceof BaseEntity)) {
      return false;
    }

    return this._id === other._id;
  }
}
