import { LightningElement, api} from "lwc";
export default class Paginator extends LightningElement {

  /** The current page number. */

  @api pageNumber;
  /** The number of items on a page. */
   @api pageSize;
  /** The total number of items in the list. */ 
  @api totalItemCount ;

  handlePrevious() {
    this.dispatchEvent(new CustomEvent("previous"));
  }
  handleNext() {
    this.dispatchEvent(new CustomEvent("next"));
  }
  get currentPageNumber() {
    /*eslint-disable no-console */
   console.log(this.totalItemCount);

    return this.totalItemCount === 0 ? 0 : this.pageNumber;

  }
  get isFirstPage() {
    return this.pageNumber === 1;
  }
  get isLastPage() {
    return this.pageNumber >= this.totalPages;
  }
  get totalPages() {
    return Math.ceil(this.totalItemCount / this.pageSize);
  }
  get showLastButton() {
    if (Math.ceil(this.totalrecords / this.pagesize) === this.currentpage) {
      return true;
    }
    return false;
  }
  get showFirstButton() {
    if (this.currentpage === 1) {
      return true;
    }
    return false;
  }
}