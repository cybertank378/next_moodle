export abstract class BaseEntity<TId = string> {
  protected constructor(public readonly id: TId) {}

  public equals(other?: BaseEntity<TId>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (this === other) {
      return true;
    }
    return this.id === other.id;
  }
}
