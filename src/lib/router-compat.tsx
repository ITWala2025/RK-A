"use client";

import React, { useCallback, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams as useNextSearchParams } from 'next/navigation';
import NextLink from 'next/link';

export function useNavigate() {
  const router = useRouter();

  return useCallback((to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      if (typeof window !== 'undefined') window.history.go(to);
      return;
    }

    // Map CRM_Temp /crm/ routes to RK&A Next.js admin routes
    let nextPath = to.replace(/^\/crm(\/|$)/, '/admin$1');

    if (nextPath.startsWith('/admin/tax-reports')) {
      nextPath = '/admin/finance/reports';
    }

    // Handle /crm/customer-360?id=...
    if (nextPath.startsWith('/admin/customer-360')) {
      try {
        const url = new URL(nextPath, 'http://localhost');
        const id = url.searchParams.get('id');
        const tab = url.searchParams.get('tab');
        if (id) {
          nextPath = `/admin/customers/${id}${tab ? `?tab=${tab}` : ''}`;
        } else {
          nextPath = '/admin/customers';
        }
      } catch {
        // keep as is
      }
    }

    // Schedule navigation in a macrotask so it never executes during a React render cycle
    setTimeout(() => {
      try {
        if (options?.replace) {
          router.replace(nextPath);
        } else {
          router.push(nextPath);
        }
      } catch (err) {
        console.warn('Navigation error:', err);
      }
    }, 0);
  }, [router]);
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useNextSearchParams();

  return useMemo(() => {
    const search = searchParams?.toString() ? `?${searchParams.toString()}` : '';
    return {
      pathname: pathname || '',
      search,
      hash: '',
      state: null,
      key: 'location-key',
    };
  }, [pathname, searchParams]);
}

export function useSearchParams() {
  const nextSearchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentParams = useMemo(() => {
    return new URLSearchParams(nextSearchParams ? nextSearchParams.toString() : '');
  }, [nextSearchParams]);

  const setSearchParams = useCallback((
    params: Record<string, string> | URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
    options?: { replace?: boolean }
  ) => {
    const updated = new URLSearchParams(currentParams.toString());
    if (typeof params === 'function') {
      const result = params(new URLSearchParams(updated.toString()));
      const url = `${pathname}?${result.toString()}`;
      setTimeout(() => {
        if (options?.replace) router.replace(url);
        else router.push(url);
      }, 0);
    } else if (params instanceof URLSearchParams) {
      const url = `${pathname}?${params.toString()}`;
      setTimeout(() => {
        if (options?.replace) router.replace(url);
        else router.push(url);
      }, 0);
    } else {
      Object.entries(params).forEach(([key, val]) => {
        if (val === undefined || val === null || val === '') {
          updated.delete(key);
        } else {
          updated.set(key, val);
        }
      });
      const qs = updated.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      setTimeout(() => {
        if (options?.replace) router.replace(url);
        else router.push(url);
      }, 0);
    }
  }, [currentParams, pathname, router]);

  return [currentParams, setSearchParams] as const;
}

export function Link({ to, href, children, ...props }: any) {
  const target = to || href || '#';
  let mapped = typeof target === 'string' ? target.replace(/^\/crm(\/|$)/, '/admin$1') : target;
  if (typeof mapped === 'string' && mapped.startsWith('/admin/tax-reports')) {
    mapped = '/admin/finance/reports';
  }
  return (
    <NextLink href={mapped} {...props}>
      {children}
    </NextLink>
  );
}

export default {
  useNavigate,
  useLocation,
  useSearchParams,
  Link,
};
