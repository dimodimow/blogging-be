import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/role.enum';
import UploadFileDto from './dto/upload-file.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('S3')
@Controller('s3')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload/:blogId')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('blogId') blogId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/jpeg' }),
          new MaxFileSizeValidator({ maxSize: 300000 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req,
  ): Promise<void> {
    const { username } = req.user;

    await this.s3Service.uploadFileAsync(
      new UploadFileDto(file.originalname, file.buffer, file.mimetype),
      username,
      blogId,
    );
  }
}
