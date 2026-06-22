import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { BlogPost } from '@/lib/models/BlogPost';

export async function GET() {
  try {
    await dbConnect();
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const post = await BlogPost.create(data);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
