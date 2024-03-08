import cheerio from 'cheerio';
import { NodeHtmlMarkdown } from 'node-html-markdown';

interface Page {
  url: string;
  content: string;
}

class Crawler {
  private seen = new Set<string>();
  private pages: Page[] = [];
  private queue: { url: string; depth: number }[] = [];

  constructor(private maxDepth = 2, private maxPages = 1) {}

  async crawl(startUrl: string): Promise<Page[]> {
    // Capture the hostname of the start URL
    let startHostname;
    try {
      startHostname = new URL(startUrl).hostname;
    } catch (error) {
      throw new Error(`Invalid URL: ${startUrl}`);
    }

    // Add the start URL to the queue
    this.addToQueue(startUrl);

    // While there are URLs in the queue and we haven't reached the maximum number of pages...
    while (this.shouldContinueCrawling()) {
      // Dequeue the next URL and depth
      const { url, depth } = this.queue.shift()!;

      // If the depth is too great or we've already seen this URL, skip it
      if (this.isTooDeep(depth) || this.isAlreadySeen(url)) continue;

      // Add the URL to the set of seen URLs
      this.seen.add(url);

      // Fetch the page HTML
      const html = await this.fetchPage(url);

      // Parse the HTML and add the page to the list of crawled pages
      this.pages.push({ url, content: this.parseHtml(html) });

      // Pass startHostname to addNewUrlsToQueue
      this.addNewUrlsToQueue(this.extractUrls(html, url), depth, startHostname);
    }

    // Return the list of crawled pages
    return this.pages;
  }

  private isTooDeep(depth: number) {
    return depth > this.maxDepth;
  }

  private isAlreadySeen(url: string) {
    return this.seen.has(url);
  }

  private shouldContinueCrawling() {
    return this.queue.length > 0 && this.pages.length < this.maxPages;
  }

  private addToQueue(url: string, depth = 0) {
    this.queue.push({ url, depth });
  }

  private addNewUrlsToQueue(
    urls: string[],
    depth: number,
    startHostname: string
  ) {
    const filteredUrls = urls.filter((url) => {
      try {
        const hostname = new URL(url).hostname;
        return hostname === startHostname;
      } catch (e) {
        console.error(`Invalid URL: ${url}`);
        return false;
      }
    });

    this.queue.push(...filteredUrls.map((url) => ({ url, depth: depth + 1 })));
  }

  private async fetchPage(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      return await response.text();
    } catch (error) {
      console.error(`Failed to fetch ${url}: ${error}`);
      return '';
    }
  }

  private parseHtml(html: string): string {
    const $ = cheerio.load(html);
    $('a').removeAttr('href');
    return NodeHtmlMarkdown.translate($.html());
  }

  private extractUrls(html: string, baseUrl: string): string[] {
    const $ = cheerio.load(html);
    const relativeUrls = $('a')
      .map((_, link) => $(link).attr('href'))
      .get() as string[];

    try {
      const relativeMap = relativeUrls.map(
        (relativeUrl) => new URL(relativeUrl, baseUrl).href
      );

      return relativeMap;
    } catch (error) {
      console.error('Error extracting URLs:', error);
      return [];
    }
  }
}

export { Crawler };
export type { Page };
