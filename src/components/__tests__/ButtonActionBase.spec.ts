import {describe, it, expect} from 'vitest';
import {fireEvent, render, screen, getByTitle} from '@testing-library/vue';
import {installQuasarPlugin} from '@quasar/quasar-app-extension-testing-unit-vitest';
import {QBtn, QIcon} from 'quasar';

// component under test
import ButtonActionBase from '../ButtonActionBase.vue';


installQuasarPlugin({components: {QBtn, QIcon}});

describe('ButtonActionBase', () => {
	const renderComponent = (propOverrides?: Record<string, unknown>) => render(ButtonActionBase, {
		props: {
			toggleState: false,
			iconName: 'thumb_up',
			...propOverrides,
		},
	});

	it('emits click', async () => {
		const { emitted } = renderComponent();

		const button = screen.getByRole('button');
		await fireEvent.click(button);
		const emittedEvents = emitted();

		expect(emittedEvents).toHaveProperty('click');
		expect(emittedEvents?.click).toHaveLength(2); // name and $event
	});

	it('indicates enabled when true', () => {
		renderComponent({
			toggleState: true,
		});

		const button = screen.getByRole('button');
		const icon = getByTitle(button, 'thumb_up');

		expect(icon.classList).toContain('enabled');
	});
});
