import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  text: string;
  value: any;
}

@Component({
  selector: 'preptm-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor, OnChanges, OnDestroy, AfterViewInit {
  @Input() options: SelectOption[] = [];
  @Input() placeholder = '';
  @Input() showSearch = false;
  @Input() allowClear = false;
  @Input() disabled = false;
  @Input() size: 'default' | 'large' = 'default';

  @Output() valueChange = new EventEmitter<any>();

  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('triggerEl') triggerRef?: ElementRef<HTMLElement>;

  isOpen = false;
  searchText = '';
  selectedValue: any = null;
  highlightedIndex = -1;

  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};
  private readonly isBrowser: boolean;

  constructor(
    private host: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {}

  ngOnChanges(_: SimpleChanges): void {
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {}

  // ControlValueAccessor
  writeValue(value: any): void {
    this.selectedValue = value ?? null;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  get filteredOptions(): SelectOption[] {
    const list = this.options || [];
    if (!this.searchText.trim()) return list;
    const q = this.searchText.toLowerCase();
    return list.filter(o => String(o.text ?? '').toLowerCase().includes(q));
  }

  get selectedOption(): SelectOption | undefined {
    if (this.selectedValue === null || this.selectedValue === undefined) return undefined;
    return (this.options || []).find(o => o.value === this.selectedValue);
  }

  get displayText(): string {
    return this.selectedOption?.text ?? '';
  }

  toggle(): void {
    if (this.disabled) return;
    if (this.isOpen) this.close();
    else this.open();
  }

  open(): void {
    if (this.disabled) return;
    this.isOpen = true;
    this.searchText = '';
    const list = this.filteredOptions;
    this.highlightedIndex = list.findIndex(o => o.value === this.selectedValue);
    if (this.highlightedIndex < 0 && list.length) this.highlightedIndex = 0;
    this.cdr.markForCheck();
    if (this.showSearch && this.isBrowser) {
      queueMicrotask(() => this.searchInputRef?.nativeElement.focus());
    }
  }

  close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.searchText = '';
    this.highlightedIndex = -1;
    this.onTouched();
    this.cdr.markForCheck();
  }

  selectOption(opt: SelectOption): void {
    if (this.disabled) return;
    if (this.selectedValue !== opt.value) {
      this.selectedValue = opt.value;
      this.onChange(opt.value);
      this.valueChange.emit(opt.value);
    }
    this.close();
    this.triggerRef?.nativeElement.focus();
  }

  clear(event: Event): void {
    event.stopPropagation();
    if (this.disabled) return;
    if (this.selectedValue !== null) {
      this.selectedValue = null;
      this.onChange(null);
      this.valueChange.emit(null);
      this.cdr.markForCheck();
    }
  }

  onSearchInput(value: string): void {
    this.searchText = value;
    this.highlightedIndex = this.filteredOptions.length ? 0 : -1;
    this.cdr.markForCheck();
  }

  trackByValue = (_: number, opt: SelectOption) => opt.value;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    if (!this.isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        this.open();
      }
      return;
    }

    const list = this.filteredOptions;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        this.triggerRef?.nativeElement.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (list.length) {
          this.highlightedIndex = (this.highlightedIndex + 1) % list.length;
          this.cdr.markForCheck();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (list.length) {
          this.highlightedIndex = this.highlightedIndex <= 0 ? list.length - 1 : this.highlightedIndex - 1;
          this.cdr.markForCheck();
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (this.highlightedIndex >= 0 && list[this.highlightedIndex]) {
          this.selectOption(list[this.highlightedIndex]);
        }
        break;
      case 'Tab':
        this.close();
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen) return;
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.close();
      this.cdr.markForCheck();
    }
  }
}
