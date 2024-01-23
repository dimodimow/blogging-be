import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';
import { BusinessException } from 'src/utils/exceptions/business.exception';
import {
  TAG_ALREADY_EXISTS,
  TAG_NAME_MUST_START_WITH_HASH,
  TAG_NAME_REQUIRED,
} from 'src/utils/constants/exception.constants';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async getByNamesAsync(names: string[]): Promise<Tag[]> {
    return await this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.name IN (:...names)', { names })
      .getMany();
  }

  async getAsync(name: string): Promise<Tag[]> {
    const query = this.tagRepository.createQueryBuilder('tag');

    if (name) {
      query.where('tag.name ILIKE :name', { name: `%${name}%` });
    }

    const tags = await query.getMany();

    return tags;
  }

  async createAsync(name: string): Promise<Tag> {
    if (!name) {
      throw new BusinessException(TAG_NAME_REQUIRED);
    }

    if (name[0] !== '#') {
      throw new BusinessException(TAG_NAME_MUST_START_WITH_HASH);
    }

    const existingTag = await this.getOneByNameAsync(name);

    if (existingTag) {
      throw new BusinessException(TAG_ALREADY_EXISTS);
    }

    const newTag = this.tagRepository.create({ name });
    await this.tagRepository.save(newTag);

    return newTag;
  }

  async removeAsync(names: string[]): Promise<void> {
    const tags = await this.getByNamesAsync(names);

    await this.tagRepository.remove(tags);
  }

  private async getOneByNameAsync(name: string): Promise<Tag> {
    return await this.tagRepository.findOneBy({ name });
  }
}
