import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    const newBlog = this.blogRepository.create(createBlogDto);
    await this.blogRepository.save(newBlog);

    return newBlog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.blogRepository.findOneBy({ id });
    const updatedBlog = this.blogRepository.merge(blog, updateBlogDto);

    updatedBlog.modifiedOn = new Date();

    await this.blogRepository.save(updatedBlog);

    return updatedBlog;
  }

  async findAll(): Promise<Blog[]> {
    return await this.blogRepository.find({ relations: ['comments'] });
  }

  async findOneById(id: string): Promise<Blog> {
    return await this.blogRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    const blog = await this.findOneById(id);

    if (!blog) {
      throw new Error('Blog not found');
    }

    await this.blogRepository.remove(blog);
  }
}
