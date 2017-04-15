import { CollabPage } from './app.po';

describe('collab App', () => {
  let page: CollabPage;

  beforeEach(() => {
    page = new CollabPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
