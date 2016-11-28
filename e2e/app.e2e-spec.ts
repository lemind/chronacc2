import { Chronacc2Page } from './app.po';

describe('chronacc2 App', function() {
  let page: Chronacc2Page;

  beforeEach(() => {
    page = new Chronacc2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
