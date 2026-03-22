import { put } from '@vercel/blob';

export async function uploadFile(file: File, filename: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set');
  }

  const blob = await put(filename, file, {
    access: 'public',
  });

  return blob;
}

export async function deleteFile(url: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set');
  }

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}
