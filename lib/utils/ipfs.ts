/**
 * Convert IPFS and Arweave URLs to use public gateways that don't have CORS restrictions
 * Handles both ipfs://, ar:// protocols and private gateway URLs
 */
export function convertToPublicIPFS(url: string | undefined): string | undefined {
  if (!url) return undefined;

  // Handle ipfs:// protocol
  if (url.startsWith('ipfs://')) {
    const hash = url.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${hash}`;
  }

  // Handle ar:// protocol (Arweave)
  if (url.startsWith('ar://')) {
    const hash = url.replace('ar://', '');
    return `https://arweave.net/${hash}`;
  }

  // Handle byzantion.mypinata.cloud gateway (403 errors)
  if (url.includes('byzantion.mypinata.cloud')) {
    const match = url.match(/\/ipfs\/(.*)/);
    if (match) {
      return `https://ipfs.io/ipfs/${match[1]}`;
    }
  }

  // Handle other Pinata gateways
  if (url.includes('.mypinata.cloud') || url.includes('gateway.pinata.cloud')) {
    const match = url.match(/\/ipfs\/(.*)/);
    if (match) {
      return `https://ipfs.io/ipfs/${match[1]}`;
    }
  }

  // Return original URL if not an IPFS/Arweave URL
  return url;
}
