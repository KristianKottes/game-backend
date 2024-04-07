import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export class BaseRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
  constructor(target: EntityTarget<Entity>, protected dataSource: DataSource) {
    super(target, dataSource.createEntityManager());
  }
}
