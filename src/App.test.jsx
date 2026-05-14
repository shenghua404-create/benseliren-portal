import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('本色丽人门户网站', () => {
  it('renders the approved hero, navigation, services, products, and process content', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /以东方肤感与现代配方，共创你的护肤品牌/ })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '开启品牌共创' })).toHaveAttribute('href', '#contact');
    expect(screen.getByRole('link', { name: '了解代加工流程' })).toHaveAttribute(
      'href',
      '#process'
    );
    expect(screen.getByRole('link', { name: '代加工服务' })).toHaveAttribute(
      'href',
      '#services'
    );
    expect(screen.getByRole('heading', { name: 'OEM/ODM 代加工' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '本色丽人自有产品' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '舒缓修护系列' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '补水保湿系列' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '1. 需求沟通' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '4. 生产交付' })).toBeInTheDocument();
  });

  it('shows a local success message after the consultation form is submitted', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('姓名'), '陈女士');
    await user.selectOptions(screen.getByLabelText('品牌阶段'), '正在准备首款产品');
    await user.selectOptions(screen.getByLabelText('需求类型'), 'OEM/ODM 代加工');
    await user.type(screen.getByLabelText('联系方式'), '13800000000');
    await user.type(screen.getByLabelText('留言'), '想了解舒缓修护精华的打样流程');
    await user.click(screen.getByRole('button', { name: '提交咨询' }));

    expect(
      screen.getByText('咨询信息已记录在当前页面，请通过下方联系方式继续沟通。')
    ).toBeInTheDocument();
  });
});
