import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './blog.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogFilter } from './blog.filter';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
  ) {}

  async createAsync(createBlogDto: CreateBlogDto): Promise<Blog> {
    const newBlog = this.blogRepository.create(createBlogDto);
    await this.blogRepository.save(newBlog);

    return newBlog;
  }

  async updateAsync(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.blogRepository.findOneBy({ id });
    const updatedBlog = this.blogRepository.merge(blog, updateBlogDto);

    updatedBlog.modifiedOn = new Date();

    await this.blogRepository.save(updatedBlog);

    return updatedBlog;
  }

  async findAll(blogFilter: BlogFilter): Promise<Blog[]> {
    const query = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.comments', 'comment')
      .leftJoinAndSelect('blog.user', 'user');

    this.filterBlogs(query, blogFilter);

    const blogs = await query.getMany();

    return blogs;
  }

  async findOneByIdAsync(id: string): Promise<Blog> {
    return await this.blogRepository.findOneBy({ id });
  }

  async removeAsync(id: string): Promise<void> {
    const blog = await this.findOneByIdAsync(id);

    if (!blog) {
      throw new Error('Blog not found');
    }

    await this.blogRepository.remove(blog);
  }

  private filterBlogs(
    queryBuilder: SelectQueryBuilder<Blog>,
    filter: BlogFilter,
  ): void {
    if (filter.title) {
      queryBuilder.andWhere('LOWER(blog.title) like LOWER(:title)', {
        title: `%${filter.title}%`,
      });
    }

    if (filter.username) {
      queryBuilder.andWhere('LOWER(user.username) like LOWER(:username)', {
        username: `%${filter.username}%`,
      });
    }
  }
}
