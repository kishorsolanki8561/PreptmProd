import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { MetaDefinition } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { CoreService } from 'src/app/core/services/core.service';

export interface SiteMapEntry {
  slugUrl: string;
  modifiedDate: string;
  changeFreq: string;
  priority: number;
}

export interface SiteMapGroup {
  label: string;
  icon: string;
  color: string;
  entries: SiteMapEntry[];
}

const CATEGORY_META: Record<string, { label: string; icon: string; color: string }> = {
  '':              { label: 'Home',         icon: 'home',            color: '#087B82' },
  'article':       { label: 'Articles',     icon: 'article',         color: '#1e3a5f' },
  'jobs':          { label: 'Govt. Jobs',   icon: 'work',            color: '#14532d' },
  'private-jobs':  { label: 'Private Jobs', icon: 'business_center', color: '#4c1d95' },
  'admissions':    { label: 'Admissions',   icon: 'school',          color: '#134e4a' },
  'results':       { label: 'Results',      icon: 'emoji_events',    color: '#7c2d12' },
  'exams':         { label: 'Exams',        icon: 'quiz',            color: '#1e40af' },
  'admit-cards':   { label: 'Admit Cards',  icon: 'badge',           color: '#881337' },
  'answer-key':    { label: 'Answer Keys',  icon: 'key',             color: '#92400e' },
  'online-form':   { label: 'Online Forms', icon: 'edit_note',       color: '#065f65' },
  'schemes':       { label: 'Schemes',      icon: 'policy',          color: '#312e81' },
  'syllabus':      { label: 'Syllabus',     icon: 'menu_book',       color: '#065f65' },
  'papers':        { label: 'Papers',       icon: 'description',     color: '#1e3a5f' },
  'notes':         { label: 'Notes',        icon: 'notes',           color: '#14532d' },
};

@Component({
  selector: 'preptm-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {
  isLoading = true;
  hasError = false;
  groups: SiteMapGroup[] = [];
  filteredGroups: SiteMapGroup[] = [];
  searchText = '';
  totalUrls = 0;
  activeFilter = 'all';

  private _http: HttpClient;

  constructor(
    handler: HttpBackend,
    private _coreService: CoreService,
    private renderer: Renderer2
  ) {
    // Use HttpBackend to bypass the AuthInterceptor which forces responseType:'json'
    this._http = new HttpClient(handler);
    this._coreService.setPageTitle('Sitemap — Preptm');
  }

  ngOnInit(): void {
    this._setMetaTags();

    const url = environment.baseApiUrl + 'front/Dashboard/GetSitemap';
    this._http.get(url, { responseType: 'text' }).subscribe({
      next: (xml) => {
        const entries = this._parseXml(xml);
        this.totalUrls = entries.length;
        this.groups = this._buildGroups(entries);
        this.filteredGroups = [...this.groups];
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  // Regex-based parser — works on both server (Node.js) and browser
  private _parseXml(xml: string): SiteMapEntry[] {
    const entries: SiteMapEntry[] = [];
    const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
    for (const block of urlBlocks) {
      const get = (tag: string) => {
        const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
        return m ? m[1].trim() : '';
      };
      const slugUrl = get('loc');
      if (slugUrl) {
        entries.push({
          slugUrl,
          modifiedDate: get('lastmod'),
          changeFreq:   get('changefreq'),
          priority:     parseFloat(get('priority') || '0'),
        });
      }
    }
    return entries;
  }

  private _buildGroups(entries: SiteMapEntry[]): SiteMapGroup[] {
    const map = new Map<string, SiteMapEntry[]>();
    for (const e of entries) {
      const key = this._categoryKey(e.slugUrl);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    const groups: SiteMapGroup[] = [];
    map.forEach((items, key) => {
      const meta = CATEGORY_META[key] ?? { label: this._titleCase(key || 'Other'), icon: 'link', color: '#087B82' };
      groups.push({ ...meta, entries: items });
    });
    return groups.sort((a, b) => b.entries.length - a.entries.length);
  }

  private _categoryKey(url: string): string {
    try {
      const path = new URL(url).pathname.replace(/^\//, '').split('/');
      return path[0] || '';
    } catch {
      return '';
    }
  }

  private _titleCase(str: string): string {
    return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  pageLabel(url: string): string {
    try {
      const parts = new URL(url).pathname.replace(/^\/|\/$/g, '').split('/');
      const last = parts[parts.length - 1] || 'Home';
      return this._titleCase(last);
    } catch {
      return url;
    }
  }

  private _setMetaTags(): void {
    const tags: MetaDefinition[] = [
      { property: 'og:type',        content: 'website' },
      { property: 'og:title',       content: 'Sitemap — Preptm' },
      { property: 'description',    content: 'Complete sitemap of Preptm. Browse all government job notifications, admit cards, results, syllabus, exam updates, and articles.' },
      { property: 'og:description', content: 'Complete sitemap of Preptm. Browse all government job notifications, admit cards, results, syllabus, exam updates, and articles.' },
      { property: 'keywords',       content: 'Preptm sitemap, government jobs, sarkari naukri, admit cards, results, syllabus, exam updates' },
    ];
    this._coreService.manageMetaTags(tags, this.renderer);
  }

  onSearch(value: string): void {
    this.searchText = value;
    this._applyFilter();
  }

  setFilter(key: string): void {
    this.activeFilter = key;
    this._applyFilter();
  }

  private _applyFilter(): void {
    let source = this.activeFilter === 'all'
      ? this.groups
      : this.groups.filter(g => g.label === this.activeFilter);

    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase();
      source = source.map(g => ({
        ...g,
        entries: g.entries.filter(e =>
          e.slugUrl.toLowerCase().includes(q) || this.pageLabel(e.slugUrl).toLowerCase().includes(q)
        )
      })).filter(g => g.entries.length > 0);
    }
    this.filteredGroups = source;
  }
}
