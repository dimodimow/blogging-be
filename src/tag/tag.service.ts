import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async getOneByNameAsync(name: string): Promise<Tag> {
    return await this.tagRepository.findOneBy({ name });
  }

  async createAsync(name: string): Promise<Tag> {
    if (!name) {
      throw new Error('Tag name is required');
    }

    if (name[0] !== '#') {
      throw new Error('Tag name must start with #');
    }

    const existingTag = await this.getOneByNameAsync(name);

    if (existingTag) {
      throw new Error('Tag already exists');
    }

    const newTag = this.tagRepository.create({ name });
    await this.tagRepository.save(newTag);

    return newTag;
  }
}
