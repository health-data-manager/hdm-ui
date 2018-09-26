import { fullRenderContainer } from '../../../utils/testHelpers';
import Providers from '../../../containers/dashboard/Providers';
import { profileMockA } from '../../../__mocks__/profileMocks';
import { providerMockA, providerMockB, providerMockC, providerMockD, providerMockE }
  from '../../../__mocks__/providerMocks';
import { profileProviderMockA, profileProviderMockB } from '../../../__mocks__/profileProviderMocks';

function setup(providers = [], profileProviders = []) {
  const store = {
    profiles: { activeProfileId: profileMockA.id },
    providers: { providers, profileProviders }
  };

  const props = {
    linkProviders: jest.fn(),
    loadProfileProviders: jest.fn()
  };

  return fullRenderContainer(Providers, props, store);
}

it('renders self and self components', () => {
  const providers = [providerMockA, providerMockB, providerMockC, providerMockD, providerMockE];
  const profileProviders = [profileProviderMockA, profileProviderMockB];
  const component = setup(providers, profileProviders);

  expect(component).toBeDefined();
  expect(component.find('div.providers')).toExist();
  expect(component.find('div.providers-search')).toExist();
  expect(component.find('div.providers-list')).toExist();
  expect(component.find('div.no-entries')).toHaveLength(0);
});

it('renders all providers', () => {
  const providers = [providerMockA, providerMockB, providerMockC, providerMockD, providerMockE];
  const profileProviders = [profileProviderMockA, profileProviderMockB];
  const component = setup(providers, profileProviders);

  expect(component.find('div.provider-card')).toHaveLength(2);
  expect(component.find('div.provider-card__titlebar-name').at(0).text()).toEqual('Anne Arundel Medical Center');
  expect(component.find('div.provider-card__titlebar-name').at(1).text()).toEqual('FitBit');
});

it('displays no entries message if there are no provider profiles', () => {
  const component = setup([providerMockA, providerMockB, providerMockC, providerMockD, providerMockE], []);

  expect(component.find('div.providers-search')).toExist();
  expect(component.find('div.providers-list')).toExist();
  expect(component.find('div.no-entries')).toExist();
  expect(component.find('div.provider-card')).toHaveLength(0);
});

it('displays the correct images for each provider', () => {
  const providers = [providerMockA, providerMockB, providerMockC, providerMockD, providerMockE];
  const profileProviders = [profileProviderMockA, profileProviderMockB];
  const component = setup(providers, profileProviders);

  expect(component.find('div.provider-card__titlebar-icon')).toHaveLength(2);
  expect(component.find('div.provider-card__details').at(0).find('img.details-logo__img')).toHaveLength(1);
  expect(component.find('div.provider-card__details').at(0).find('img.details-logo__img').prop('src'))
    .toEqual('data:image/jpeg;base64,' + providerMockE.logo);
  expect(component.find('div.provider-card__details').at(1).find('img.details-logo__img')).toHaveLength(0);
});
