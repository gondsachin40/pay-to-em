export {}; 
declare global {
  namespace Express {
    interface Request {
        user?: {
            id: number,
            userName: string,
        }
      // Or use a more specific type
      // user?: User; 
    }
  }
}