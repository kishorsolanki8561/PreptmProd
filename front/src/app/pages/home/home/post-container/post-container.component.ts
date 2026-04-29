import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Post } from 'src/app/core/models/post.model';
// import { DatePipe } from '@angular/common';

@Component({
  selector: 'preptm-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.scss'],
  // providers: [DatePipe]
  
})
export class PostContainerComponent implements OnInit, OnChanges {
  @Input() className: string;
  @Input() showLoader: boolean;
  @Input() posts: Post[] | undefined;
  @Input() heading: string;
  @Input() viewMoreUrl: string;
  curDate:Date = new Date();

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['posts'].currentValue?.length){
      this.posts?.forEach((item)=>{
        if(item.publishedDate){
          item['isNew'] = this.checkNewPost(item.publishedDate)
        }
      })
    }
  }



  checkNewPost(createDate: any): boolean {
    // Calculate the difference in milliseconds
    const timeDifference = Math.abs(this.curDate.getTime() - new Date(createDate).getTime());

    // Convert the difference to days
    const daysDifference = Math.ceil(timeDifference / (86400000));    // 1000 * 3600 * 24 = 86400000
    return daysDifference < 3;
  }


}
