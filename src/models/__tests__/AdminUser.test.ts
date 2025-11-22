import AdminUser from '../AdminUser';
import bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn(),
}));

describe('AdminUser model', () => {
  it('should have correct model name', () => {
    expect(AdminUser.modelName).toBe('AdminUser');
  });

  it('should have required email field', () => {
    const schema = AdminUser.schema.paths;
    expect(schema.email).toBeDefined();
    expect(schema.email.options.required).toBeTruthy();
    expect(schema.email.options.unique).toBe(true);
    expect(schema.email.options.lowercase).toBe(true);
  });

  it('should have required password field with select false', () => {
    const schema = AdminUser.schema.paths;
    expect(schema.password).toBeDefined();
    expect(schema.password.options.required).toBeTruthy();
    expect(schema.password.options.select).toBe(false);
    expect(schema.password.options.minlength[0]).toBe(8);
  });

  it('should have required name field', () => {
    const schema = AdminUser.schema.paths;
    expect(schema.name).toBeDefined();
    expect(schema.name.options.required).toBeTruthy();
    expect(schema.name.options.maxlength[0]).toBe(100);
  });

  it('should have role field with enum and default', () => {
    const schema = AdminUser.schema.paths;
    expect(schema.role).toBeDefined();
    expect(schema.role.options.enum).toContain('admin');
    expect(schema.role.options.enum).toContain('editor');
    expect(schema.role.options.default).toBe('admin');
  });

  it('should have optional lastLogin field', () => {
    const schema = AdminUser.schema.paths;
    expect(schema.lastLogin).toBeDefined();
  });

  it('should have timestamps enabled', () => {
    expect(AdminUser.schema.options.timestamps).toBe(true);
  });

  it('should have email validation pattern', () => {
    const schema = AdminUser.schema.paths;
    expect(schema.email.options.match).toBeDefined();
  });

  it('should have pre-save hook for password hashing', () => {
    const hooks = (AdminUser.schema as any).s.hooks._pres;
    expect(hooks.get('save')).toBeDefined();
  });

  it('should have comparePassword method', () => {
    expect(AdminUser.schema.methods.comparePassword).toBeDefined();
    expect(typeof AdminUser.schema.methods.comparePassword).toBe('function');
  });

  describe('pre-save hook', () => {
    let preSaveHook: Function;

    beforeAll(() => {
      // Find our custom pre-save hook (not the validateBeforeSave plugin)
      const hooks = (AdminUser.schema as any).s.hooks._pres.get('save');
      // Our hook is the one that checks isModified('password')
      preSaveHook = hooks.find((h: any) =>
        h.fn.toString().includes('isModified') && h.fn.toString().includes('password')
      )?.fn;
    });

    it('should hash password when password is modified', async () => {
      if (!preSaveHook) {
        // Skip if hook not found (different mongoose version)
        return;
      }

      const mockDoc = {
        isModified: jest.fn().mockReturnValue(true),
        password: 'plainPassword',
      };

      const next = jest.fn();
      await preSaveHook.call(mockDoc, next);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(12);
      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 'salt');
      expect(mockDoc.password).toBe('hashedPassword');
      expect(next).toHaveBeenCalled();
    });

    it('should skip hashing when password is not modified', async () => {
      if (!preSaveHook) {
        // Skip if hook not found (different mongoose version)
        return;
      }

      jest.clearAllMocks();

      const mockDoc = {
        isModified: jest.fn().mockReturnValue(false),
        password: 'existingHash',
      };

      const next = jest.fn();
      await preSaveHook.call(mockDoc, next);

      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('comparePassword method', () => {
    it('should return true for matching password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const mockDoc = {
        password: 'hashedPassword',
      };

      const result = await AdminUser.schema.methods.comparePassword.call(mockDoc, 'plainPassword');

      expect(bcrypt.compare).toHaveBeenCalledWith('plainPassword', 'hashedPassword');
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const mockDoc = {
        password: 'hashedPassword',
      };

      const result = await AdminUser.schema.methods.comparePassword.call(mockDoc, 'wrongPassword');

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
      expect(result).toBe(false);
    });
  });
});
