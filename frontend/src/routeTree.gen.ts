/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SignupImport } from './routes/signup'
import { Route as LoginImport } from './routes/login'
import { Route as FaqImport } from './routes/faq'
import { Route as EditorImport } from './routes/editor'
import { Route as ContactImport } from './routes/contact'
import { Route as AuthButtonsImport } from './routes/auth-buttons'
import { Route as ApprovedImport } from './routes/approved'
import { Route as ApproveImport } from './routes/approve'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'
import { Route as DocsIndexImport } from './routes/docs/index'
import { Route as DocsDocIdImport } from './routes/docs/$docId'

// Create/Update Routes

const SignupRoute = SignupImport.update({
  id: '/signup',
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const FaqRoute = FaqImport.update({
  id: '/faq',
  path: '/faq',
  getParentRoute: () => rootRoute,
} as any)

const EditorRoute = EditorImport.update({
  id: '/editor',
  path: '/editor',
  getParentRoute: () => rootRoute,
} as any)

const ContactRoute = ContactImport.update({
  id: '/contact',
  path: '/contact',
  getParentRoute: () => rootRoute,
} as any)

const AuthButtonsRoute = AuthButtonsImport.update({
  id: '/auth-buttons',
  path: '/auth-buttons',
  getParentRoute: () => rootRoute,
} as any)

const ApprovedRoute = ApprovedImport.update({
  id: '/approved',
  path: '/approved',
  getParentRoute: () => rootRoute,
} as any)

const ApproveRoute = ApproveImport.update({
  id: '/approve',
  path: '/approve',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const DocsIndexRoute = DocsIndexImport.update({
  id: '/docs/',
  path: '/docs/',
  getParentRoute: () => rootRoute,
} as any)

const DocsDocIdRoute = DocsDocIdImport.update({
  id: '/docs/$docId',
  path: '/docs/$docId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/approve': {
      id: '/approve'
      path: '/approve'
      fullPath: '/approve'
      preLoaderRoute: typeof ApproveImport
      parentRoute: typeof rootRoute
    }
    '/approved': {
      id: '/approved'
      path: '/approved'
      fullPath: '/approved'
      preLoaderRoute: typeof ApprovedImport
      parentRoute: typeof rootRoute
    }
    '/auth-buttons': {
      id: '/auth-buttons'
      path: '/auth-buttons'
      fullPath: '/auth-buttons'
      preLoaderRoute: typeof AuthButtonsImport
      parentRoute: typeof rootRoute
    }
    '/contact': {
      id: '/contact'
      path: '/contact'
      fullPath: '/contact'
      preLoaderRoute: typeof ContactImport
      parentRoute: typeof rootRoute
    }
    '/editor': {
      id: '/editor'
      path: '/editor'
      fullPath: '/editor'
      preLoaderRoute: typeof EditorImport
      parentRoute: typeof rootRoute
    }
    '/faq': {
      id: '/faq'
      path: '/faq'
      fullPath: '/faq'
      preLoaderRoute: typeof FaqImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/signup': {
      id: '/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof SignupImport
      parentRoute: typeof rootRoute
    }
    '/docs/$docId': {
      id: '/docs/$docId'
      path: '/docs/$docId'
      fullPath: '/docs/$docId'
      preLoaderRoute: typeof DocsDocIdImport
      parentRoute: typeof rootRoute
    }
    '/docs/': {
      id: '/docs/'
      path: '/docs'
      fullPath: '/docs'
      preLoaderRoute: typeof DocsIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/approve': typeof ApproveRoute
  '/approved': typeof ApprovedRoute
  '/auth-buttons': typeof AuthButtonsRoute
  '/contact': typeof ContactRoute
  '/editor': typeof EditorRoute
  '/faq': typeof FaqRoute
  '/login': typeof LoginRoute
  '/signup': typeof SignupRoute
  '/docs/$docId': typeof DocsDocIdRoute
  '/docs': typeof DocsIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/approve': typeof ApproveRoute
  '/approved': typeof ApprovedRoute
  '/auth-buttons': typeof AuthButtonsRoute
  '/contact': typeof ContactRoute
  '/editor': typeof EditorRoute
  '/faq': typeof FaqRoute
  '/login': typeof LoginRoute
  '/signup': typeof SignupRoute
  '/docs/$docId': typeof DocsDocIdRoute
  '/docs': typeof DocsIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/approve': typeof ApproveRoute
  '/approved': typeof ApprovedRoute
  '/auth-buttons': typeof AuthButtonsRoute
  '/contact': typeof ContactRoute
  '/editor': typeof EditorRoute
  '/faq': typeof FaqRoute
  '/login': typeof LoginRoute
  '/signup': typeof SignupRoute
  '/docs/$docId': typeof DocsDocIdRoute
  '/docs/': typeof DocsIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/approve'
    | '/approved'
    | '/auth-buttons'
    | '/contact'
    | '/editor'
    | '/faq'
    | '/login'
    | '/signup'
    | '/docs/$docId'
    | '/docs'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/approve'
    | '/approved'
    | '/auth-buttons'
    | '/contact'
    | '/editor'
    | '/faq'
    | '/login'
    | '/signup'
    | '/docs/$docId'
    | '/docs'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/approve'
    | '/approved'
    | '/auth-buttons'
    | '/contact'
    | '/editor'
    | '/faq'
    | '/login'
    | '/signup'
    | '/docs/$docId'
    | '/docs/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  ApproveRoute: typeof ApproveRoute
  ApprovedRoute: typeof ApprovedRoute
  AuthButtonsRoute: typeof AuthButtonsRoute
  ContactRoute: typeof ContactRoute
  EditorRoute: typeof EditorRoute
  FaqRoute: typeof FaqRoute
  LoginRoute: typeof LoginRoute
  SignupRoute: typeof SignupRoute
  DocsDocIdRoute: typeof DocsDocIdRoute
  DocsIndexRoute: typeof DocsIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  ApproveRoute: ApproveRoute,
  ApprovedRoute: ApprovedRoute,
  AuthButtonsRoute: AuthButtonsRoute,
  ContactRoute: ContactRoute,
  EditorRoute: EditorRoute,
  FaqRoute: FaqRoute,
  LoginRoute: LoginRoute,
  SignupRoute: SignupRoute,
  DocsDocIdRoute: DocsDocIdRoute,
  DocsIndexRoute: DocsIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/approve",
        "/approved",
        "/auth-buttons",
        "/contact",
        "/editor",
        "/faq",
        "/login",
        "/signup",
        "/docs/$docId",
        "/docs/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/approve": {
      "filePath": "approve.tsx"
    },
    "/approved": {
      "filePath": "approved.tsx"
    },
    "/auth-buttons": {
      "filePath": "auth-buttons.tsx"
    },
    "/contact": {
      "filePath": "contact.tsx"
    },
    "/editor": {
      "filePath": "editor.tsx"
    },
    "/faq": {
      "filePath": "faq.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/signup": {
      "filePath": "signup.tsx"
    },
    "/docs/$docId": {
      "filePath": "docs/$docId.tsx"
    },
    "/docs/": {
      "filePath": "docs/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
