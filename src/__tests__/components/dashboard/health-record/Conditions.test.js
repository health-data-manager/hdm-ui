import { fullRenderComponent } from '../../../../utils/testHelpers';
import Conditions from '../../../../components/dashboard/health-record/Conditions';
import TableList from '../../../../components/dashboard/shared/TableList';
import VerticalTimeline from '../../../../components/dashboard/shared/VerticalTimeline';
import * as mocks from '../../../../__mocks__/conditionMocks';

function setup() {
  const props = {
    conditions: [
      mocks.conditionMockA,
      mocks.conditionMockB,
      mocks.conditionMockC,
      mocks.conditionMockD,
      mocks.conditionMockE
    ]
  };
  return fullRenderComponent(Conditions, props);
}

it('renders self and self components', () => {
  const component = setup();

  expect(component).toBeDefined();
  expect(component.find(VerticalTimeline)).toExist();
  expect(component.find(TableList)).toExist();
  expect(component.find('div.no-entries')).toHaveLength(0);
});

it('it renders and filters the condition table correctly', () => {
  const component = setup();

  expect(component.find('.table-list tbody tr')).toHaveLength(3);
});

it('sorts condition table correctly', () => {
  const component = setup();

  expect(component.find('.table-list tbody tr').at(0).text() === 'Hypertension');
  expect(component.find('.table-list tbody tr').at(1).text() === 'Perennial allergic rhinitis');
  expect(component.find('.table-list tbody tr').at(2).text() === 'Osteoporosis (disorder)');
});

it('displays no entries message if no conditions', () => {
  const component = fullRenderComponent(Conditions, { conditions: [] });

  expect(component.find('div.no-entries')).toExist();
  expect(component.find(TableList)).toHaveLength(0);
  expect(component.find(VerticalTimeline)).toHaveLength(0);
});

it('table is not displayed if no current conditions', () => {
  const component = fullRenderComponent(Conditions, { conditions: [mocks.conditionMockA] });

  expect(component.find(TableList)).toExist();
  expect(component.find('.table-list tbody tr')).toHaveLength(0);
  expect(component.find('.table-list div.no-entries')).toExist();
  expect(component.find(VerticalTimeline)).toExist();
});

it('it renders the vertical timeline correctly correctly', () => {
  const component = setup();

  expect(component.find(VerticalTimeline)).toExist();
  expect(component.find('div.vertical-timeline__item')).toHaveLength(3);
  expect(component.find('button.vertical-timeline__view-more')).toExist();
  expect(component.find('div.vertical-timeline__item-info').at(0).text() === 'Viral sinusitis (disorder)');
  expect(component.find('div.vertical-timeline__item-info').at(1).text() === 'Hypertension');
  expect(component.find('div.vertical-timeline__item-info').at(2).text() === 'Viral sinusitis (disorder)');
});
