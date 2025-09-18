import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const industry = searchParams.get('industry') || '';
    const province = searchParams.get('province') || '';
    const size = searchParams.get('size') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const offset = (page - 1) * limit;

    const supabase = await createClient();
    
    // Check if user is authenticated and is Indigenous business
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user type
    const { data: userProfile } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if ((userProfile as any)?.user_type !== 'indigenous_business') {
      return NextResponse.json({ 
        error: 'Only Indigenous businesses can search for partners' 
      }, { status: 403 });
    }

    // Build query
    let businessQuery = supabase
      .from('businesses')
      .select('*', { count: 'exact' })
      .eq('indigenous_owned', false)
      .eq('open_to_partnership', true)
      .neq('verification_status', 'banned');

    // Apply filters
    if (query) {
      businessQuery = businessQuery.or(
        `business_name.ilike.%${query}%,description.ilike.%${query}%`
      );
    }

    if (industry) {
      businessQuery = businessQuery.contains('industry_codes', [industry]);
    }

    if (province) {
      businessQuery = businessQuery.eq('province', province);
    }

    if (size) {
      businessQuery = businessQuery.eq('number_of_employees', size);
    }

    // Add pagination
    businessQuery = businessQuery
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    const { data, error, count } = await businessQuery;

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json({ 
        error: 'Failed to search businesses' 
      }, { status: 500 });
    }

    return NextResponse.json({
      businesses: data || [],
      totalCount: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}