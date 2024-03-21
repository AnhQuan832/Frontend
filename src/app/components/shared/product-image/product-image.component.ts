import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
    selector: 'app-product-image',
    templateUrl: './product-image.component.html',
    styleUrls: ['./product-image.component.scss'],
})
export class ProductImageComponent implements OnInit, OnChanges {
    @Input() images: string[];
    displayedThumbnails: string[] = [];
    currentImage: string;
    currentIndex: number = 0;
    thumbnailIndex: number = 0;
    isAtStart: boolean = true;
    isAtEnd: boolean = false;

    constructor(public layout: ModalService) {}
    ngOnInit() {
        if (this.images && this.images.length > 0) {
            this.currentImage = this.images[0];
        }
        this.updateDisplayedThumbnails();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.images && this.images.length > 0) {
            this.currentImage = this.images[0];
        } else if (this.images.length === 0) {
            this.images = ['../../../assets/images/empty-image-list.svg'];
        }
        this.updateDisplayedThumbnails();
    }

    changeImage(img: string): void {
        this.currentImage = img;
        this.currentIndex = this.images.indexOf(img);
    }

    previousImage(): void {
        this.currentIndex =
            (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.currentImage = this.images[this.currentIndex];
        this.ensureThumbnailVisible();
    }

    nextImage(): void {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.currentImage = this.images[this.currentIndex];
        this.ensureThumbnailVisible();
    }

    ensureThumbnailVisible(): void {
        if (this.currentIndex < this.thumbnailIndex) {
            this.thumbnailIndex = this.currentIndex;
        } else if (this.currentIndex > this.thumbnailIndex + 3) {
            this.thumbnailIndex = this.currentIndex - 3;
        }
        this.updateDisplayedThumbnails();
    }

    previousThumbnail(): void {
        this.thumbnailIndex = Math.max(0, this.thumbnailIndex - 1);
        this.updateDisplayedThumbnails();
    }

    nextThumbnail(): void {
        this.thumbnailIndex = Math.min(
            this.images.length - 4,
            this.thumbnailIndex + 1
        );
        this.updateDisplayedThumbnails();
    }

    updateDisplayedThumbnails(): void {
        this.displayedThumbnails = this.images.slice(
            this.thumbnailIndex,
            this.thumbnailIndex + 4
        );
        this.isAtStart = this.thumbnailIndex === 0;
        this.isAtEnd = this.thumbnailIndex === this.images.length - 4;
    }
}
