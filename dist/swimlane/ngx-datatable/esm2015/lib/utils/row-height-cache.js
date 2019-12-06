/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * This object contains the cache of the various row heights that are present inside
 * the data table.   Its based on Fenwick tree data structure that helps with
 * querying sums that have time complexity of log n.
 *
 * Fenwick Tree Credits: http://petr-mitrichev.blogspot.com/2013/05/fenwick-tree-range-updates.html
 * https://github.com/mikolalysenko/fenwick-tree
 *
 */
export class RowHeightCache {
    constructor() {
        /**
         * Tree Array stores the cumulative information of the row heights to perform efficient
         * range queries and updates.  Currently the tree is initialized to the base row
         * height instead of the detail row height.
         */
        this.treeArray = [];
    }
    /**
     * Clear the Tree array.
     * @return {?}
     */
    clearCache() {
        this.treeArray = [];
    }
    /**
     * Initialize the Fenwick tree with row Heights.
     *
     * @param {?} details
     * @return {?}
     */
    initCache(details) {
        const { rows, rowHeight, detailRowHeight, externalVirtual, rowCount, rowIndexes, rowExpansions } = details;
        /** @type {?} */
        const isFn = typeof rowHeight === 'function';
        /** @type {?} */
        const isDetailFn = typeof detailRowHeight === 'function';
        if (!isFn && isNaN(rowHeight)) {
            throw new Error(`Row Height cache initialization failed. Please ensure that 'rowHeight' is a
        valid number or function value: (${rowHeight}) when 'scrollbarV' is enabled.`);
        }
        // Add this additional guard in case detailRowHeight is set to 'auto' as it wont work.
        if (!isDetailFn && isNaN(detailRowHeight)) {
            throw new Error(`Row Height cache initialization failed. Please ensure that 'detailRowHeight' is a
        valid number or function value: (${detailRowHeight}) when 'scrollbarV' is enabled.`);
        }
        /** @type {?} */
        const n = externalVirtual ? rowCount : rows.length;
        this.treeArray = new Array(n);
        for (let i = 0; i < n; ++i) {
            this.treeArray[i] = 0;
        }
        for (let i = 0; i < n; ++i) {
            /** @type {?} */
            const row = rows[i];
            /** @type {?} */
            let currentRowHeight = rowHeight;
            if (isFn) {
                currentRowHeight = rowHeight(row);
            }
            // Add the detail row height to the already expanded rows.
            // This is useful for the table that goes through a filter or sort.
            /** @type {?} */
            const expanded = rowExpansions.has(row);
            if (row && expanded) {
                if (isDetailFn) {
                    /** @type {?} */
                    const index = rowIndexes.get(row);
                    currentRowHeight += detailRowHeight(row, index);
                }
                else {
                    currentRowHeight += detailRowHeight;
                }
            }
            this.update(i, currentRowHeight);
        }
    }
    /**
     * Given the ScrollY position i.e. sum, provide the rowIndex
     * that is present in the current view port.  Below handles edge cases.
     * @param {?} scrollY
     * @return {?}
     */
    getRowIndex(scrollY) {
        if (scrollY === 0)
            return 0;
        return this.calcRowIndex(scrollY);
    }
    /**
     * When a row is expanded or rowHeight is changed, update the height.  This can
     * be utilized in future when Angular Data table supports dynamic row heights.
     * @param {?} atRowIndex
     * @param {?} byRowHeight
     * @return {?}
     */
    update(atRowIndex, byRowHeight) {
        if (!this.treeArray.length) {
            throw new Error(`Update at index ${atRowIndex} with value ${byRowHeight} failed:
        Row Height cache not initialized.`);
        }
        /** @type {?} */
        const n = this.treeArray.length;
        atRowIndex |= 0;
        while (atRowIndex < n) {
            this.treeArray[atRowIndex] += byRowHeight;
            atRowIndex |= atRowIndex + 1;
        }
    }
    /**
     * Range Sum query from 1 to the rowIndex
     * @param {?} atIndex
     * @return {?}
     */
    query(atIndex) {
        if (!this.treeArray.length) {
            throw new Error(`query at index ${atIndex} failed: Fenwick tree array not initialized.`);
        }
        /** @type {?} */
        let sum = 0;
        atIndex |= 0;
        while (atIndex >= 0) {
            sum += this.treeArray[atIndex];
            atIndex = (atIndex & (atIndex + 1)) - 1;
        }
        return sum;
    }
    /**
     * Find the total height between 2 row indexes
     * @param {?} atIndexA
     * @param {?} atIndexB
     * @return {?}
     */
    queryBetween(atIndexA, atIndexB) {
        return this.query(atIndexB) - this.query(atIndexA - 1);
    }
    /**
     * Given the ScrollY position i.e. sum, provide the rowIndex
     * that is present in the current view port.
     * @private
     * @param {?} sum
     * @return {?}
     */
    calcRowIndex(sum) {
        if (!this.treeArray.length)
            return 0;
        /** @type {?} */
        let pos = -1;
        /** @type {?} */
        const dataLength = this.treeArray.length;
        // Get the highest bit for the block size.
        /** @type {?} */
        const highestBit = Math.pow(2, dataLength.toString(2).length - 1);
        for (let blockSize = highestBit; blockSize !== 0; blockSize >>= 1) {
            /** @type {?} */
            const nextPos = pos + blockSize;
            if (nextPos < dataLength && sum >= this.treeArray[nextPos]) {
                sum -= this.treeArray[nextPos];
                pos = nextPos;
            }
        }
        return pos + 1;
    }
}
if (false) {
    /**
     * Tree Array stores the cumulative information of the row heights to perform efficient
     * range queries and updates.  Currently the tree is initialized to the base row
     * height instead of the detail row height.
     * @type {?}
     * @private
     */
    RowHeightCache.prototype.treeArray;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LWhlaWdodC1jYWNoZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL3Jvdy1oZWlnaHQtY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQVNBLE1BQU0sT0FBTyxjQUFjO0lBQTNCOzs7Ozs7UUFNVSxjQUFTLEdBQWEsRUFBRSxDQUFDO0lBMkluQyxDQUFDOzs7OztJQXRJQyxVQUFVO1FBQ1IsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQzs7Ozs7OztJQVNELFNBQVMsQ0FBQyxPQUFZO2NBQ2QsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsR0FBRyxPQUFPOztjQUNwRyxJQUFJLEdBQUcsT0FBTyxTQUFTLEtBQUssVUFBVTs7Y0FDdEMsVUFBVSxHQUFHLE9BQU8sZUFBZSxLQUFLLFVBQVU7UUFFeEQsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQzsyQ0FDcUIsU0FBUyxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ2xGO1FBRUQsc0ZBQXNGO1FBQ3RGLElBQUksQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQ3pDLE1BQU0sSUFBSSxLQUFLLENBQUM7MkNBQ3FCLGVBQWUsaUNBQWlDLENBQUMsQ0FBQztTQUN4Rjs7Y0FFSyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNO1FBQ2xELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN2QjtRQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7O2tCQUNwQixHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQzs7Z0JBQ2YsZ0JBQWdCLEdBQUcsU0FBUztZQUNoQyxJQUFJLElBQUksRUFBRTtnQkFDUixnQkFBZ0IsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbkM7Ozs7a0JBSUssUUFBUSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO1lBQ3ZDLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRTtnQkFDbkIsSUFBSSxVQUFVLEVBQUU7OzBCQUNSLEtBQUssR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztvQkFDakMsZ0JBQWdCLElBQUksZUFBZSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDakQ7cUJBQU07b0JBQ0wsZ0JBQWdCLElBQUksZUFBZSxDQUFDO2lCQUNyQzthQUNGO1lBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7Ozs7Ozs7SUFNRCxXQUFXLENBQUMsT0FBZTtRQUN6QixJQUFJLE9BQU8sS0FBSyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Ozs7Ozs7O0lBTUQsTUFBTSxDQUFDLFVBQWtCLEVBQUUsV0FBbUI7UUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO1lBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLFVBQVUsZUFBZSxXQUFXOzBDQUNuQyxDQUFDLENBQUM7U0FDdkM7O2NBRUssQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTtRQUMvQixVQUFVLElBQUksQ0FBQyxDQUFDO1FBRWhCLE9BQU8sVUFBVSxHQUFHLENBQUMsRUFBRTtZQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFdBQVcsQ0FBQztZQUMxQyxVQUFVLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUM7Ozs7OztJQUtELEtBQUssQ0FBQyxPQUFlO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtZQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixPQUFPLDhDQUE4QyxDQUFDLENBQUM7U0FDMUY7O1lBRUcsR0FBRyxHQUFHLENBQUM7UUFDWCxPQUFPLElBQUksQ0FBQyxDQUFDO1FBRWIsT0FBTyxPQUFPLElBQUksQ0FBQyxFQUFFO1lBQ25CLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9CLE9BQU8sR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN6QztRQUVELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQzs7Ozs7OztJQUtELFlBQVksQ0FBQyxRQUFnQixFQUFFLFFBQWdCO1FBQzdDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDOzs7Ozs7OztJQU1PLFlBQVksQ0FBQyxHQUFXO1FBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU07WUFBRSxPQUFPLENBQUMsQ0FBQzs7WUFFakMsR0FBRyxHQUFHLENBQUMsQ0FBQzs7Y0FDTixVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNOzs7Y0FHbEMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUVqRSxLQUFLLElBQUksU0FBUyxHQUFHLFVBQVUsRUFBRSxTQUFTLEtBQUssQ0FBQyxFQUFFLFNBQVMsS0FBSyxDQUFDLEVBQUU7O2tCQUMzRCxPQUFPLEdBQUcsR0FBRyxHQUFHLFNBQVM7WUFDL0IsSUFBSSxPQUFPLEdBQUcsVUFBVSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUMxRCxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDL0IsR0FBRyxHQUFHLE9BQU8sQ0FBQzthQUNmO1NBQ0Y7UUFFRCxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDakIsQ0FBQztDQUNGOzs7Ozs7Ozs7SUEzSUMsbUNBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGlzIG9iamVjdCBjb250YWlucyB0aGUgY2FjaGUgb2YgdGhlIHZhcmlvdXMgcm93IGhlaWdodHMgdGhhdCBhcmUgcHJlc2VudCBpbnNpZGVcbiAqIHRoZSBkYXRhIHRhYmxlLiAgIEl0cyBiYXNlZCBvbiBGZW53aWNrIHRyZWUgZGF0YSBzdHJ1Y3R1cmUgdGhhdCBoZWxwcyB3aXRoXG4gKiBxdWVyeWluZyBzdW1zIHRoYXQgaGF2ZSB0aW1lIGNvbXBsZXhpdHkgb2YgbG9nIG4uXG4gKlxuICogRmVud2ljayBUcmVlIENyZWRpdHM6IGh0dHA6Ly9wZXRyLW1pdHJpY2hldi5ibG9nc3BvdC5jb20vMjAxMy8wNS9mZW53aWNrLXRyZWUtcmFuZ2UtdXBkYXRlcy5odG1sXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbWlrb2xhbHlzZW5rby9mZW53aWNrLXRyZWVcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBSb3dIZWlnaHRDYWNoZSB7XG4gIC8qKlxuICAgKiBUcmVlIEFycmF5IHN0b3JlcyB0aGUgY3VtdWxhdGl2ZSBpbmZvcm1hdGlvbiBvZiB0aGUgcm93IGhlaWdodHMgdG8gcGVyZm9ybSBlZmZpY2llbnRcbiAgICogcmFuZ2UgcXVlcmllcyBhbmQgdXBkYXRlcy4gIEN1cnJlbnRseSB0aGUgdHJlZSBpcyBpbml0aWFsaXplZCB0byB0aGUgYmFzZSByb3dcbiAgICogaGVpZ2h0IGluc3RlYWQgb2YgdGhlIGRldGFpbCByb3cgaGVpZ2h0LlxuICAgKi9cbiAgcHJpdmF0ZSB0cmVlQXJyYXk6IG51bWJlcltdID0gW107XG5cbiAgLyoqXG4gICAqIENsZWFyIHRoZSBUcmVlIGFycmF5LlxuICAgKi9cbiAgY2xlYXJDYWNoZSgpOiB2b2lkIHtcbiAgICB0aGlzLnRyZWVBcnJheSA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIEZlbndpY2sgdHJlZSB3aXRoIHJvdyBIZWlnaHRzLlxuICAgKlxuICAgKiBAcGFyYW0gcm93cyBUaGUgYXJyYXkgb2Ygcm93cyB3aGljaCBjb250YWluIHRoZSBleHBhbmRlZCBzdGF0dXMuXG4gICAqIEBwYXJhbSByb3dIZWlnaHQgVGhlIHJvdyBoZWlnaHQuXG4gICAqIEBwYXJhbSBkZXRhaWxSb3dIZWlnaHQgVGhlIGRldGFpbCByb3cgaGVpZ2h0LlxuICAgKi9cbiAgaW5pdENhY2hlKGRldGFpbHM6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IHsgcm93cywgcm93SGVpZ2h0LCBkZXRhaWxSb3dIZWlnaHQsIGV4dGVybmFsVmlydHVhbCwgcm93Q291bnQsIHJvd0luZGV4ZXMsIHJvd0V4cGFuc2lvbnMgfSA9IGRldGFpbHM7XG4gICAgY29uc3QgaXNGbiA9IHR5cGVvZiByb3dIZWlnaHQgPT09ICdmdW5jdGlvbic7XG4gICAgY29uc3QgaXNEZXRhaWxGbiA9IHR5cGVvZiBkZXRhaWxSb3dIZWlnaHQgPT09ICdmdW5jdGlvbic7XG5cbiAgICBpZiAoIWlzRm4gJiYgaXNOYU4ocm93SGVpZ2h0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBSb3cgSGVpZ2h0IGNhY2hlIGluaXRpYWxpemF0aW9uIGZhaWxlZC4gUGxlYXNlIGVuc3VyZSB0aGF0ICdyb3dIZWlnaHQnIGlzIGFcbiAgICAgICAgdmFsaWQgbnVtYmVyIG9yIGZ1bmN0aW9uIHZhbHVlOiAoJHtyb3dIZWlnaHR9KSB3aGVuICdzY3JvbGxiYXJWJyBpcyBlbmFibGVkLmApO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGlzIGFkZGl0aW9uYWwgZ3VhcmQgaW4gY2FzZSBkZXRhaWxSb3dIZWlnaHQgaXMgc2V0IHRvICdhdXRvJyBhcyBpdCB3b250IHdvcmsuXG4gICAgaWYgKCFpc0RldGFpbEZuICYmIGlzTmFOKGRldGFpbFJvd0hlaWdodCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUm93IEhlaWdodCBjYWNoZSBpbml0aWFsaXphdGlvbiBmYWlsZWQuIFBsZWFzZSBlbnN1cmUgdGhhdCAnZGV0YWlsUm93SGVpZ2h0JyBpcyBhXG4gICAgICAgIHZhbGlkIG51bWJlciBvciBmdW5jdGlvbiB2YWx1ZTogKCR7ZGV0YWlsUm93SGVpZ2h0fSkgd2hlbiAnc2Nyb2xsYmFyVicgaXMgZW5hYmxlZC5gKTtcbiAgICB9XG5cbiAgICBjb25zdCBuID0gZXh0ZXJuYWxWaXJ0dWFsID8gcm93Q291bnQgOiByb3dzLmxlbmd0aDtcbiAgICB0aGlzLnRyZWVBcnJheSA9IG5ldyBBcnJheShuKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICB0aGlzLnRyZWVBcnJheVtpXSA9IDA7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHJvd3NbaV07XG4gICAgICBsZXQgY3VycmVudFJvd0hlaWdodCA9IHJvd0hlaWdodDtcbiAgICAgIGlmIChpc0ZuKSB7XG4gICAgICAgIGN1cnJlbnRSb3dIZWlnaHQgPSByb3dIZWlnaHQocm93KTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoZSBkZXRhaWwgcm93IGhlaWdodCB0byB0aGUgYWxyZWFkeSBleHBhbmRlZCByb3dzLlxuICAgICAgLy8gVGhpcyBpcyB1c2VmdWwgZm9yIHRoZSB0YWJsZSB0aGF0IGdvZXMgdGhyb3VnaCBhIGZpbHRlciBvciBzb3J0LlxuICAgICAgY29uc3QgZXhwYW5kZWQgPSByb3dFeHBhbnNpb25zLmhhcyhyb3cpO1xuICAgICAgaWYgKHJvdyAmJiBleHBhbmRlZCkge1xuICAgICAgICBpZiAoaXNEZXRhaWxGbikge1xuICAgICAgICAgIGNvbnN0IGluZGV4ID0gcm93SW5kZXhlcy5nZXQocm93KTtcbiAgICAgICAgICBjdXJyZW50Um93SGVpZ2h0ICs9IGRldGFpbFJvd0hlaWdodChyb3csIGluZGV4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdXJyZW50Um93SGVpZ2h0ICs9IGRldGFpbFJvd0hlaWdodDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnVwZGF0ZShpLCBjdXJyZW50Um93SGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gdGhlIFNjcm9sbFkgcG9zaXRpb24gaS5lLiBzdW0sIHByb3ZpZGUgdGhlIHJvd0luZGV4XG4gICAqIHRoYXQgaXMgcHJlc2VudCBpbiB0aGUgY3VycmVudCB2aWV3IHBvcnQuICBCZWxvdyBoYW5kbGVzIGVkZ2UgY2FzZXMuXG4gICAqL1xuICBnZXRSb3dJbmRleChzY3JvbGxZOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGlmIChzY3JvbGxZID09PSAwKSByZXR1cm4gMDtcbiAgICByZXR1cm4gdGhpcy5jYWxjUm93SW5kZXgoc2Nyb2xsWSk7XG4gIH1cblxuICAvKipcbiAgICogV2hlbiBhIHJvdyBpcyBleHBhbmRlZCBvciByb3dIZWlnaHQgaXMgY2hhbmdlZCwgdXBkYXRlIHRoZSBoZWlnaHQuICBUaGlzIGNhblxuICAgKiBiZSB1dGlsaXplZCBpbiBmdXR1cmUgd2hlbiBBbmd1bGFyIERhdGEgdGFibGUgc3VwcG9ydHMgZHluYW1pYyByb3cgaGVpZ2h0cy5cbiAgICovXG4gIHVwZGF0ZShhdFJvd0luZGV4OiBudW1iZXIsIGJ5Um93SGVpZ2h0OiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMudHJlZUFycmF5Lmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVcGRhdGUgYXQgaW5kZXggJHthdFJvd0luZGV4fSB3aXRoIHZhbHVlICR7YnlSb3dIZWlnaHR9IGZhaWxlZDpcbiAgICAgICAgUm93IEhlaWdodCBjYWNoZSBub3QgaW5pdGlhbGl6ZWQuYCk7XG4gICAgfVxuXG4gICAgY29uc3QgbiA9IHRoaXMudHJlZUFycmF5Lmxlbmd0aDtcbiAgICBhdFJvd0luZGV4IHw9IDA7XG5cbiAgICB3aGlsZSAoYXRSb3dJbmRleCA8IG4pIHtcbiAgICAgIHRoaXMudHJlZUFycmF5W2F0Um93SW5kZXhdICs9IGJ5Um93SGVpZ2h0O1xuICAgICAgYXRSb3dJbmRleCB8PSBhdFJvd0luZGV4ICsgMTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmFuZ2UgU3VtIHF1ZXJ5IGZyb20gMSB0byB0aGUgcm93SW5kZXhcbiAgICovXG4gIHF1ZXJ5KGF0SW5kZXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgaWYgKCF0aGlzLnRyZWVBcnJheS5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgcXVlcnkgYXQgaW5kZXggJHthdEluZGV4fSBmYWlsZWQ6IEZlbndpY2sgdHJlZSBhcnJheSBub3QgaW5pdGlhbGl6ZWQuYCk7XG4gICAgfVxuXG4gICAgbGV0IHN1bSA9IDA7XG4gICAgYXRJbmRleCB8PSAwO1xuXG4gICAgd2hpbGUgKGF0SW5kZXggPj0gMCkge1xuICAgICAgc3VtICs9IHRoaXMudHJlZUFycmF5W2F0SW5kZXhdO1xuICAgICAgYXRJbmRleCA9IChhdEluZGV4ICYgKGF0SW5kZXggKyAxKSkgLSAxO1xuICAgIH1cblxuICAgIHJldHVybiBzdW07XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgdG90YWwgaGVpZ2h0IGJldHdlZW4gMiByb3cgaW5kZXhlc1xuICAgKi9cbiAgcXVlcnlCZXR3ZWVuKGF0SW5kZXhBOiBudW1iZXIsIGF0SW5kZXhCOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnF1ZXJ5KGF0SW5kZXhCKSAtIHRoaXMucXVlcnkoYXRJbmRleEEgLSAxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiB0aGUgU2Nyb2xsWSBwb3NpdGlvbiBpLmUuIHN1bSwgcHJvdmlkZSB0aGUgcm93SW5kZXhcbiAgICogdGhhdCBpcyBwcmVzZW50IGluIHRoZSBjdXJyZW50IHZpZXcgcG9ydC5cbiAgICovXG4gIHByaXZhdGUgY2FsY1Jvd0luZGV4KHN1bTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAoIXRoaXMudHJlZUFycmF5Lmxlbmd0aCkgcmV0dXJuIDA7XG5cbiAgICBsZXQgcG9zID0gLTE7XG4gICAgY29uc3QgZGF0YUxlbmd0aCA9IHRoaXMudHJlZUFycmF5Lmxlbmd0aDtcblxuICAgIC8vIEdldCB0aGUgaGlnaGVzdCBiaXQgZm9yIHRoZSBibG9jayBzaXplLlxuICAgIGNvbnN0IGhpZ2hlc3RCaXQgPSBNYXRoLnBvdygyLCBkYXRhTGVuZ3RoLnRvU3RyaW5nKDIpLmxlbmd0aCAtIDEpO1xuXG4gICAgZm9yIChsZXQgYmxvY2tTaXplID0gaGlnaGVzdEJpdDsgYmxvY2tTaXplICE9PSAwOyBibG9ja1NpemUgPj49IDEpIHtcbiAgICAgIGNvbnN0IG5leHRQb3MgPSBwb3MgKyBibG9ja1NpemU7XG4gICAgICBpZiAobmV4dFBvcyA8IGRhdGFMZW5ndGggJiYgc3VtID49IHRoaXMudHJlZUFycmF5W25leHRQb3NdKSB7XG4gICAgICAgIHN1bSAtPSB0aGlzLnRyZWVBcnJheVtuZXh0UG9zXTtcbiAgICAgICAgcG9zID0gbmV4dFBvcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcG9zICsgMTtcbiAgfVxufVxuIl19