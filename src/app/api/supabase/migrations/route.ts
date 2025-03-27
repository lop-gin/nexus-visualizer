
import { NextRequest, NextResponse } from 'next/server';
import { createRoles, createModules } from '@/lib/supabase/migrations';

/**
 * API route for initializing and migrating Supabase database.
 * This should only be used in development and managed deployments.
 */
export async function GET(request: NextRequest) {
  try {
    // Check if API key is provided as a query parameter for security
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');
    
    if (!apiKey || apiKey !== process.env.MIGRATION_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'Invalid API key' },
        { status: 401 }
      );
    }
    
    // Perform migrations
    const results = [];
    
    // Create roles table and insert predefined roles
    try {
      const rolesResult = await createRoles();
      results.push({ operation: 'createRoles', success: true });
    } catch (error: any) {
      console.error('Error creating roles:', error);
      results.push({ 
        operation: 'createRoles', 
        success: false,
        message: error.message 
      });
    }
    
    // Create modules table and insert default modules
    try {
      const modulesResult = await createModules();
      results.push({ operation: 'createModules', success: true });
    } catch (error: any) {
      console.error('Error creating modules:', error);
      results.push({ 
        operation: 'createModules', 
        success: false, 
        message: error.message 
      });
    }
    
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Error running migrations:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to run migrations' },
      { status: 500 }
    );
  }
}
