import { VisualizerPage } from './app.po';

describe('visualizer App', function() {
  let page: VisualizerPage;

  beforeEach(() => {
    page = new VisualizerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
