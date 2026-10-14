import { AnyRoute, AnyRouter, ParsedLocation } from '@tanstack/router-core';
import * as React from 'react';
declare module '@tanstack/router-core' {
    interface RouterStores<in out TRouteTree extends AnyRoute> {
        /**
         * The link scope of each route id that rendered links, keyed `undefined`
         * for links outside every match (route ids start with `/` or are the
         * root id). A scope without links holds no location.
         */
        _linkScopes?: Record<string, LinkScope>;
    }
}
/**
 * The location source shared by the links of one route. It holds one location
 * subscription for all of them while any is subscribed, and skips a
 * publication whose navigation removes the route: those links keep the
 * location their route still presents until it unmounts or a newer
 * publication keeps it. Without subscribers it holds nothing and reads the
 * live location.
 */
export type LinkScope = [
    getSource: () => ParsedLocation,
    subscribe: (listener: () => void) => () => void
];
export declare function createLinkScope(router: AnyRouter, routeId?: string): LinkScope;
export declare const matchContext: React.Context<string | undefined>;
export declare const dummyMatchContext: React.Context<string | undefined>;
