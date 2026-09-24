export abstract class BaseService {
  protected readonly serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  public getServiceName(): string {
    return this.serviceName;
  }
}
