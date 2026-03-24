class AddFilenameToImages < ActiveRecord::Migration[8.1]
  def change
    add_column :images, :filename, :string
  end
end
