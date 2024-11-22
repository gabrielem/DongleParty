// utils/rateLimiter.ts
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing: boolean = false;
  private requestsThisWindow: number = 0;
  private windowStart: number = Date.now();
  
  // Configure these based on API limits
  private readonly RATE_LIMIT = 1; // requests per window
  private readonly TIME_WINDOW = 1100; // 1 second in milliseconds
  
  constructor() {
    this.processQueue = this.processQueue.bind(this);
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const now = Date.now();
      
      // Reset window if needed
      if (now - this.windowStart >= this.TIME_WINDOW) {
        this.windowStart = now;
        this.requestsThisWindow = 0;
      }
      
      // Check if we can process more requests
      if (this.requestsThisWindow >= this.RATE_LIMIT) {
        // Wait for next window
        await new Promise(resolve => 
          setTimeout(resolve, this.TIME_WINDOW - (now - this.windowStart))
        );
        continue;
      }
      
      const request = this.queue.shift();
      if (request) {
        this.requestsThisWindow++;
        try {
          await request();
        } catch (error) {
          console.error('Rate limited request failed:', error);
        }
      }
    }
    
    this.processing = false;
  }

  async enqueue<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }
}

export const rateLimiter = new RateLimiter();