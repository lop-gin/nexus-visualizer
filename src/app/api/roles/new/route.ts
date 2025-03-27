import { NextRequest, NextResponse } from 'next/server';
import { createRole } from '@/lib/supabase/roles-service';

// API route to create a new role
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, permissions } = body;
    
    const newRole = await createRole(name, description, permissions);
    
    return NextResponse.json(newRole, { status: 201 });
  } catch (error: any) {
    console.error('Error creating role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create role' },
      { status: 500 }
    );
  }
}
