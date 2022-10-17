import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class UpperAndFusionPipe implements PipeTransform {
  transform(entry: { data: string[] }, metadata: ArgumentMetadata) {
    // console.log(metadata);
    if (metadata.type === 'body') {
      return entry.data.map((element: string) => element.toUpperCase()).join('-');
    }

    return entry;
  }
}
